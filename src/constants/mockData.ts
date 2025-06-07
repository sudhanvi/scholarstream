import type { PdfDocument } from '@/types';

export const mockPdfDocuments: PdfDocument[] = [
  {
    id: 'doc1',
    name: 'Introduction to Quantum Physics.pdf',
    thumbnailUrl: 'https://placehold.co/200x280.png',
    fileSize: '2.3 MB',
    lastOpened: 'Yesterday',
    content: 'This document provides a comprehensive introduction to the fundamental principles of quantum physics, including wave-particle duality, the Schrödinger equation, and quantum entanglement. It explores the historical development of quantum theory and its applications in modern technology.',
    isFavorite: true,
  },
  {
    id: 'doc2',
    name: 'Advanced Calculus Textbook.pdf',
    thumbnailUrl: 'https://placehold.co/200x280.png',
    fileSize: '5.1 MB',
    lastOpened: '3 days ago',
    content: 'An advanced textbook covering topics in multivariable calculus, vector calculus, and differential equations. Includes numerous examples, exercises, and proofs. Focuses on sequences, series, and Taylor expansions.',
  },
  {
    id: 'doc3',
    name: 'Organic Chemistry Notes.pdf',
    thumbnailUrl: 'https://placehold.co/200x280.png',
    fileSize: '1.8 MB',
    lastOpened: '1 week ago',
    content: 'Lecture notes on organic chemistry, focusing on nomenclature, reaction mechanisms, and spectroscopy. Covers alkanes, alkenes, alkynes, and aromatic compounds. Includes detailed diagrams of molecular structures.',
    isFavorite: false,
  },
  {
    id: 'doc4',
    name: 'Machine Learning Basics.pdf',
    thumbnailUrl: 'https://placehold.co/200x280.png',
    fileSize: '3.5 MB',
    lastOpened: '2 hours ago',
    content: 'An introductory guide to machine learning concepts, algorithms, and applications. Discusses supervised and unsupervised learning, neural networks, and model evaluation techniques. Python examples included.',
  },
];
