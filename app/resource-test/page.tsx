'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Resource {
  Resource: string;
  Description: string;
  'Service Area': string;
  Eligibility: string;
  Website: string;
  Number: string;
  Email: string;
  Address: string;
  'Upcoming events': string;
  Opportunities: string;
  'How to support': string;
  'Women owned': boolean;
  'POC owned': boolean;
  Comments: string;
  edition: string[];
}

type ResultItem = { success: boolean; message: string };

export default function ResourceTestPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setResults([]);

    let resources: Resource[];

    // 1. Parse JSON safely
    try {
      const parsed = JSON.parse(jsonInput.trim());

      if (Array.isArray(parsed)) {
        resources = parsed as Resource[];
      } else {
        resources = [parsed as Resource];
      }
    } catch (err) {
      console.error('Error parsing JSON:', err);
      setResults([
        {
          success: false,
          message:
            'Invalid JSON format. Make sure it is valid JSON (e.g. [ { ... }, { ... } ]).',
        },
      ]);
      setIsLoading(false);
      return;
    }

    const newResults: ResultItem[] = [];

    // 2. Insert each resource
    for (const resource of resources) {
  try {
    const { data, error } = await supabase
      .from('resources')
      .insert([
        {
          // Column names MUST match your Supabase table schema
          resource: resource.Resource,
          description: resource.Description,
          service_area: resource['Service Area'],
          eligibility: resource.Eligibility,
          website: resource.Website,
          number: resource.Number,
          email: resource.Email,
          address: resource.Address,
          upcoming_events: resource['Upcoming events'],
          opportunities: resource.Opportunities,
          how_to_support: resource['How to support'],
          women_owned: resource['Women owned'],
          poc_owned: resource['POC owned'],
          comments: resource.Comments,
          edition:
        resource.edition && resource.edition.length > 0
          ? resource.edition
          : ['general'],
          is_approved: true,
        },
      ]);

    if (error) {
      // Log the full Supabase error object
      console.error(
        `Supabase error for ${resource.Resource}:`,
        JSON.stringify(error, null, 2)
      );
      newResults.push({
        success: false,
        message: `Error adding ${resource.Resource}: ${error.message}`,
      });
      continue;
    }

    newResults.push({
      success: true,
      message: `Successfully added: ${resource.Resource}`,
    });
  } catch (err) {
    // This is for network / unexpected errors
    console.error(
      `Unexpected error adding resource ${resource.Resource}:`,
      err
    );
    newResults.push({
      success: false,
      message: `Unexpected error adding ${resource.Resource}: ${
        (err as any)?.message ?? String(err)
      }`,
    });
  }
}


    setResults(newResults);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Import Resources</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="json-input"
            className="block text-sm font-medium mb-2"
          >
            Paste your JSON array of resources
          </label>
          <Textarea
            id="json-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON array here..."
            rows={20}
            className="font-mono text-sm"
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading || !jsonInput.trim()}>
            {isLoading ? 'Importing...' : 'Import Resources'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setJsonInput(exampleJson)}
            disabled={isLoading}
          >
            Load Example
          </Button>
        </div>
      </form>

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Import Results</h2>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded ${
                  result.success
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {result.success ? (
                  <span className="font-medium">✓</span>
                ) : (
                  <span className="font-medium">✗</span>
                )}{' '}
                {result.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Example JSON array that matches the Resource interface
const exampleJson = `[
  {
    "Resource": "Itasca Light & Sound-Watseland Studio",
    "Description": "Recordings Studio",
    "Service Area": "Isasca County",
    "Eligibility": "None",
    "Website": "https://www.itascalightandsound.com/",
    "Number": "651-253-4440",
    "Email": "rick@itascalightsandsound.com",
    "Address": "Moblie",
    "Upcoming events": "",
    "Opportunities": "https://www.itascalightandsound.com/projects-7",
    "How to support": "",
    "Women owned": false,
    "POC owned": false,
    "Comments": "",
    "edition": ["northern"]
  },
  {
    "Resource": "218 Dance Project",
    "Description": "Dance School & Studio",
    "Service Area": "St. Louis County",
    "Eligibility": "Student",
    "Website": "https://www.218danceproject.com/",
    "Number": "218-464-4700",
    "Email": "frontdesk@218danceproject.com",
    "Address": "5713 Grand Ave, Duluth, MN",
    "Upcoming events": "Per class",
    "Opportunities": "https://app.jackrabbitclass.com/regv2.asp?id=540644",
    "How to support": "https://garon-brothers.myshopify.com/collections/twoneight-dance-project",
    "Women owned": false,
    "POC owned": false,
    "Comments": "",
    "edition": ["northern"]
  }
]`;
