export type Park = {
  id: string;
  name: string;
  state: string;
  blurb: string;
};

export const parks: Park[] = [
  { id: 'acadia', name: 'Acadia', state: 'Maine', blurb: 'Granite peaks over the Atlantic coast.' },
  { id: 'arches', name: 'Arches', state: 'Utah', blurb: 'Over 2,000 natural stone arches.' },
  { id: 'denali', name: 'Denali', state: 'Alaska', blurb: 'North America’s tallest peak.' },
  { id: 'glacier', name: 'Glacier', state: 'Montana', blurb: 'Going-to-the-Sun Road and alpine lakes.' },
  { id: 'grand-canyon', name: 'Grand Canyon', state: 'Arizona', blurb: 'A mile deep and 277 river miles long.' },
  { id: 'great-smoky', name: 'Great Smoky Mountains', state: 'Tennessee', blurb: 'Misty ridges and old-growth forest.' },
  { id: 'joshua-tree', name: 'Joshua Tree', state: 'California', blurb: 'Where two deserts meet.' },
  { id: 'olympic', name: 'Olympic', state: 'Washington', blurb: 'Rainforest, glaciers and wild coast.' },
  { id: 'rocky-mountain', name: 'Rocky Mountain', state: 'Colorado', blurb: 'Trail Ridge Road above 12,000 feet.' },
  { id: 'yellowstone', name: 'Yellowstone', state: 'Wyoming', blurb: 'Geysers, hot springs and bison.' },
  { id: 'yosemite', name: 'Yosemite', state: 'California', blurb: 'Half Dome, El Capitan and giant sequoias.' },
  { id: 'zion', name: 'Zion', state: 'Utah', blurb: 'Red cliffs and the Narrows.' },
];
