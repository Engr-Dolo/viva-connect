/**
 * Utility to export an array of objects to a CSV file.
 * @param {Array} data - The data to export
 * @param {Array} columns - The columns to include [{ key: 'name', label: 'Name' }]
 * @param {string} filename - The name of the file to save
 */
export const exportToCSV = (data, columns, filename = 'viva-report.csv') => {
  if (!data || !data.length) return;

  const header = columns.map(col => `"${col.label}"`).join(',');
  const rows = data.map(item => {
    return columns.map(col => {
      let val = item[col.key];
      
      // Handle nested values or arrays (like volunteers)
      if (Array.isArray(val)) {
        val = val.map(v => v.name || v).join('; ');
      }
      
      // Escape quotes and wrap in quotes
      const escaped = String(val || '').replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',');
  });

  const csvContent = [header, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
