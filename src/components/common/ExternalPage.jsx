import React from 'react';

const ExternalPage = ({ url }) => {
  return (
    <div style={{ height: '100vh' }}>
      <iframe
        src={url}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="External Page"
      />
    </div>
  );
};

export default ExternalPage;
