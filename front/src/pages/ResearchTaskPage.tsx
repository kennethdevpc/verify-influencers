import React from 'react';
import ScientificJournal from '../components/ScientificJournal';
import { Link } from 'react-router-dom';
import { MoveLeft } from 'lucide-react';

type Props = {};

function ResearchTaskPage({}: Props) {
  return (
    <div className="p-6 bg-base-200 text-base-content rounded-lg container mx-auto pt-24">
      <div className="flex items-center gap-4 mb-6">
        <div className="size-9 rounded-lg  flex items-center justify-center">
          <MoveLeft className="w-5 h-5 text-green-400" />
        </div>
        <h3 className="    text-transparent bg-clip-text bg-gradient-to-r from-green-400  to-emerald-600">
          Back to Dashboard
        </h3>
        <h2 className="text-2xl font-semibold mb-4">Research Tasks</h2>
      </div>
      <div className="flex space-x-4 mb-6">
        <button className="btn btn-primary flex-1">Specific Influencer</button>
        <button className="btn btn-secondary flex-1">Discover New</button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Time Range</label>
        <div className="flex space-x-4">
          <button className="btn btn-outline">Last Week</button>
          <button className="btn btn-outline btn-active">Last Month</button>
          <button className="btn btn-outline">Last Year</button>
          <button className="btn btn-outline">All Time</button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Influencer Name</label>
        <input
          type="text"
          placeholder="Enter influencer name"
          className="input input-bordered w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Claims to Analyze Per Influencer</label>
        <input type="number" placeholder="50" className="input input-bordered w-full" />
      </div>
      <ScientificJournal />
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Notes for Research Assistant</label>
        <textarea
          placeholder="Add any specific instructions or focus areas..."
          className="textarea textarea-bordered w-full"
        ></textarea>
      </div>
    </div>
  );
}

export default ResearchTaskPage;
