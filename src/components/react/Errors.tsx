export const NotSignedIn = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-base-300/70 backdrop-blur-sm z-30">
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h1 className="text-3xl font-light">
          You need to be signed in for this feature
        </h1>
        <p className="text-lg">Please sign in to continue</p>
      </div>
    </div>
  );
};
