#!/usr/bin/env python3

import asyncio
import logging
import sys
from pathlib import Path
from datetime import datetime
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
from rich.logging import RichHandler
from rich.table import Table
from dataclasses import asdict

from config import OUTPUT_DIR, HTML_PATH, LOG_FILE, LOG_LEVEL, LOG_FORMAT
from html_parser import PrivacyPatternParser
from screenshot_capture import ScreenshotCapture
from metadata_manager import MetadataManager

# Set up logging
logging.basicConfig(
    level=LOG_LEVEL,
    format=LOG_FORMAT,
    handlers=[
        RichHandler(console=Console(stderr=True)),
        logging.FileHandler(LOG_FILE)
    ]
)
logger = logging.getLogger(__name__)

console = Console()

async def main():
    """Main function to orchestrate the privacy UI screenshot capture process."""
    console.print("[bold blue]Privacy UI Pattern Screenshot Scraper[/bold blue]")
    console.print(f"Starting at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    try:
        # Step 1: Parse the HTML document
        console.print("[yellow]Step 1: Parsing HTML document...[/yellow]")
        parser = PrivacyPatternParser(HTML_PATH)
        patterns = parser.parse()
        
        if not patterns:
            console.print("[red]No patterns found in the document![/red]")
            return
        
        console.print(f"[green] Found {len(patterns)} privacy patterns[/green]")
        
        # Display pattern summary
        table = Table(title="Privacy Patterns Found")
        table.add_column("#", style="cyan")
        table.add_column("Pattern Name", style="magenta")
        table.add_column("Examples", style="green")
        
        total_examples = 0
        for pattern in patterns:
            table.add_row(
                str(pattern.pattern_number),
                pattern.pattern_name,
                str(len(pattern.examples))
            )
            total_examples += len(pattern.examples)
        
        console.print(table)
        console.print(f"\nTotal examples to capture: {total_examples}\n")
        
        # Save parsed data for inspection
        parsed_data_path = OUTPUT_DIR / "parsed_data.json"
        parser.save_parsed_data(parsed_data_path)
        console.print(f"[dim]Saved parsed data to {parsed_data_path}[/dim]\n")
        
        # Step 2: Initialize screenshot capture
        console.print("[yellow]Step 2: Initializing browser...[/yellow]")
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        
        capture = ScreenshotCapture(OUTPUT_DIR)
        await capture.initialize()
        console.print("[green] Browser initialized[/green]\n")
        
        # Step 3: Initialize metadata manager
        metadata_manager = MetadataManager(OUTPUT_DIR)
        
        # Step 4: Capture screenshots for each pattern
        console.print("[yellow]Step 3: Capturing screenshots...[/yellow]")
        
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(),
            TaskProgressColumn(),
            console=console
        ) as progress:
            
            main_task = progress.add_task(
                "[cyan]Processing patterns...",
                total=len(patterns)
            )
            
            for pattern in patterns:
                progress.update(
                    main_task,
                    description=f"[cyan]Processing {pattern.pattern_name}..."
                )
                
                # Convert examples to dict format
                examples_dict = [asdict(example) for example in pattern.examples]
                
                # Capture screenshots for this pattern
                results = await capture.capture_pattern_screenshots(
                    pattern.pattern_number,
                    pattern.pattern_name,
                    examples_dict
                )
                
                # Update metadata
                metadata_manager.update_summary(results)
                capture.results.append(results)
                
                # Update progress
                progress.advance(main_task)
                
                # Show pattern completion
                successful = sum(1 for e in results['examples'] if e['success'])
                total = len(results['examples'])
                console.print(
                    f"  [green][/green] Pattern {pattern.pattern_number}: "
                    f"{successful}/{total} successful captures"
                )
        
        # Step 5: Generate final outputs
        console.print("\n[yellow]Step 4: Generating summary files...[/yellow]")
        
        metadata_manager.save_summary()
        metadata_manager.create_index_html()
        metadata_manager.create_main_readme()
        
        console.print("[green] Summary files created[/green]\n")
        
        # Display final summary
        summary = capture.get_summary()
        
        console.print("[bold green]Capture Complete![/bold green]")
        console.print(f"Total patterns: {summary['total_patterns']}")
        console.print(f"Total examples: {summary['total_examples']}")
        console.print(f"Successful captures: {summary['successful_captures']}")
        console.print(f"Failed captures: {summary['failed_captures']}")
        console.print(f"Success rate: {summary['success_rate']}")
        console.print(f"\nOutput directory: {OUTPUT_DIR}")
        console.print(f"View results: {OUTPUT_DIR / 'index.html'}")
        
    except Exception as e:
        logger.exception("Error in main process")
        console.print(f"[red]Error: {str(e)}[/red]")
        raise
    
    finally:
        # Clean up
        if 'capture' in locals():
            await capture.cleanup()
            console.print("\n[dim]Browser closed[/dim]")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        console.print("\n[yellow]Process interrupted by user[/yellow]")
        sys.exit(1)
    except Exception as e:
        console.print(f"\n[red]Fatal error: {str(e)}[/red]")
        sys.exit(1)