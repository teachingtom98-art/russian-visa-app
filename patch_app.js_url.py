import re

with open('app.js', 'r') as f:
    content = f.read()

# Find the end of escapeHtml to add sanitizeUrl after it
escape_html_func = """function escapeHtml(str) {
  return (str || '').replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}
"""

sanitize_url_func = """function sanitizeUrl(url) {
  if (!url) return '#';
  try {
    const parsed = new URL(url, window.location.origin);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch (e) {
    // If it's a relative URL or invalid, we fallback to simple check
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
        return url;
    }
  }
  return '#';
}
"""

content = content.replace(escape_html_func, escape_html_func + '\n' + sanitize_url_func)

with open('app.js', 'w') as f:
    f.write(content)
