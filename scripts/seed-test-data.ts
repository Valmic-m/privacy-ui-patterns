import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function seedTestData() {
  try {
    console.log('Seeding test data...');
    
    // Get a few categories
    const { data: categories, error: catError } = await supabase
      .from('pattern_categories')
      .select('*')
      .limit(3);
    
    if (catError) {
      throw new Error(`Failed to fetch categories: ${catError.message}`);
    }
    
    if (!categories || categories.length === 0) {
      throw new Error('No categories found. Please run migrations first.');
    }
    
    // Create a test pattern for each category
    for (const category of categories) {
      const { data: pattern, error: patternError } = await supabase
        .from('patterns')
        .insert({
          category_id: category.id,
          title: `Test ${category.name} Pattern`,
          slug: `test-${category.slug}-pattern`,
          description: `This is a test pattern for ${category.name}`,
          explanation: `This pattern demonstrates best practices for ${category.name.toLowerCase()}. It helps users understand and control their privacy settings effectively.`,
          relevance: `Critical for GDPR compliance and building user trust. This pattern addresses key privacy concerns in modern applications.`,
          sources: [
            { title: 'GDPR Article 7', url: 'https://gdpr-info.eu/art-7-gdpr/' },
            { title: 'Privacy by Design', url: 'https://www.ipc.on.ca/wp-content/uploads/resources/7foundationalprinciples.pdf' }
          ],
          pbd_alignment: {
            proactive: true,
            privacy_default: true,
            privacy_embedded: true
          },
          nielsen_alignment: {
            visibility: true,
            user_control: true,
            consistency: true
          }
        })
        .select()
        .single();
      
      if (patternError) {
        console.error(`Failed to create pattern for ${category.name}:`, patternError);
        continue;
      }
      
      console.log(`Created pattern: ${pattern.title}`);
      
      // Create 3 examples for each pattern
      const exampleCompanies = ['Google', 'Apple', 'Microsoft', 'Meta', 'Amazon'];
      
      for (let i = 0; i < 3; i++) {
        const company = exampleCompanies[i % exampleCompanies.length];
        
        const { error: exampleError } = await supabase
          .from('examples')
          .insert({
            pattern_id: pattern.id,
            company: company,
            title: `${company}'s implementation of ${category.name}`,
            use_case: `${company} uses this pattern for their main application`,
            description: `A detailed look at how ${company} implements privacy controls`,
            why_selected: `This example demonstrates industry best practices and innovative approaches to ${category.name.toLowerCase()}`,
            screenshot_url: `/screenshots/placeholder-${i + 1}.png`,
            source_url: `https://example.com/${company.toLowerCase()}-privacy`,
            metadata: {
              last_updated: new Date().toISOString(),
              platform: ['web', 'mobile'][i % 2]
            },
            display_order: i
          });
        
        if (exampleError) {
          console.error(`Failed to create example for ${company}:`, exampleError);
        } else {
          console.log(`  - Added example: ${company}`);
        }
      }
    }
    
    console.log('Test data seeding completed!');
    
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
seedTestData();