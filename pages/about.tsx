
import Image from 'next/image';
import authorImage from '../public/author.webp'; // Adjust the path if necessary
import { JSX } from 'react';


export default function About(): JSX.Element {
  return (
    <div className="container mx-auto p-4">
    
      <h1 className="text-4xl font-bold mb-4">O autorze</h1>
      <Image src={authorImage} alt="Author" width={500} height={500} className="rounded-full mb-4" />
      <p className="text-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </div>
  );
}
