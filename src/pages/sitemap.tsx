import { useEffect } from "react";

export default function SitemapPage() {
  useEffect(() => {
    // Generate XML sitemap dynamically
    const generateSitemap = () => {
      const baseUrl = window.location.origin;
      const currentDate = new Date().toISOString();
      
      const urls = [
        { loc: baseUrl, priority: '1.0', changefreq: 'weekly' },
        { loc: `${baseUrl}/pricing`, priority: '0.9', changefreq: 'monthly' },
        { loc: `${baseUrl}/testimonials`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${baseUrl}/case-studies`, priority: '0.8', changefreq: 'monthly' },
        { loc: `${baseUrl}/user-guide`, priority: '0.7', changefreq: 'monthly' },
        { loc: `${baseUrl}/developers`, priority: '0.6', changefreq: 'monthly' },
        { loc: `${baseUrl}/dashboard`, priority: '0.5', changefreq: 'weekly' }
      ];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      // Create downloadable sitemap
      const blob = new Blob([sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sitemap.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    // Auto-generate sitemap on page load
    generateSitemap();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 mb-6">XML Sitemap Generated</h1>
        <p className="text-blue-500 mb-4">
          Your sitemap.xml has been automatically generated and downloaded. Upload this file to your website's root directory for optimal SEO performance.
        </p>
        
        <div className="bg-blue-900 p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Sitemap URLs Included:</h2>
          <ul className="space-y-2 text-sm text-blue-500">
            <li>• Homepage (Priority: 1.0)</li>
            <li>• Pricing Page (Priority: 0.9)</li>
            <li>• Testimonials (Priority: 0.8)</li>
            <li>• Case Studies (Priority: 0.8)</li>
            <li>• User Guide (Priority: 0.7)</li>
            <li>• Developer Portal (Priority: 0.6)</li>
            <li>• Dashboard (Priority: 0.5)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}