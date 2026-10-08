import { CatalogSkeleton } from "./CatalogSkeleton";

export default function Loading() {
  return (
    <>
      <div className="border-b border-line bg-gradient-to-br from-violet-soft via-paper to-pink-soft">
        <div className="container-x space-y-4 py-10 sm:py-14">
          <div className="skeleton h-4 w-32" />
          <div className="skeleton h-12 w-full max-w-xl" />
          <div className="skeleton h-5 w-full max-w-md" />
        </div>
      </div>
      <CatalogSkeleton />
    </>
  );
}
