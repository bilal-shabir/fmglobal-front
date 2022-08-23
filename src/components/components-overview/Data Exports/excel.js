export default  (gridRef) => {
    let columns = gridRef.current.visibleColumns;
    columns = columns.filter(object => {
      return object.name !== 'data';
    });
    const SEPARATOR = ',';
    const header = columns.map((c) => c.header).join(SEPARATOR);
    const rows = gridRef.current.data.map((data) => columns.map((c) => data[c.id]).join(SEPARATOR));

    const contents = [header].concat(rows).join('\n');
    const blob = new Blob([contents], { type: 'text/csv;charset=utf-8;' });

    downloadBlob(blob);
};
const downloadBlob = (blob, fileName = 'grid-data.csv') => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
  
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.position = 'absolute';
    link.style.visibility = 'hidden';
  
    document.body.appendChild(link);
  
    link.click();
  
    document.body.removeChild(link);
  };