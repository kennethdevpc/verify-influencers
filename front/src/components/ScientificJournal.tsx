import React from 'react';

type Props = {};

function ScientificJournal({}: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Scientific Journals</label>
      <div className="  grid grid-cols-2 gap-4">
        <button className="btn btn-sm btn-outline btn-accent">PubMed Central</button>
        <button className="btn btn-sm btn-outline btn-accent">Nature</button>
        <button className="btn btn-sm btn-outline btn-accent">Science</button>
        <button className="btn btn-sm btn-outline btn-accent">Cell</button>
        <button className="btn btn-sm btn-outline btn-accent">The Lancet</button>
        <button className="btn btn-sm btn-outline btn-accent">
          New England Journal of Medicine
        </button>
      </div>
    </div>
  );
}

export default ScientificJournal;
