export const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-[300px] w-full my-auto">
      <svg
        className="animate-spin h-8 w-8 border border-l-black rounded-full"
        viewBox="0 0 24 24"
      />
    </div>
  );
};
