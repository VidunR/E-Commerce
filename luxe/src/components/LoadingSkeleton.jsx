import React from 'react';
import { Skeleton } from './ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full bg-gray-200" />
      <div className="space-y-2">
        <div className="flex justify-between">
            <Skeleton className="h-4 w-2/3 bg-gray-200" />
            <Skeleton className="h-4 w-12 bg-gray-200" />
        </div>
        <Skeleton className="h-3 w-1/3 bg-gray-200" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 4 }){
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Skeleton className="aspect-square w-full bg-gray-200" />
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4 bg-gray-200" />
          <Skeleton className="h-6 w-1/4 bg-gray-200" />
          <Skeleton className="h-24 w-full bg-gray-200" />
          <Skeleton className="h-12 w-full bg-gray-200" />
          <Skeleton className="h-12 w-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}