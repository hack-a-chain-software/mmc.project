import Logo from './loader-logo';

export const Loader = () => {
  return (
    <div
      className="w-[100vw] h-[100vh] bg-white flex items-center justify-center"
    >
      <div
        className="flex flex-col items-center justify-center space-y-[24px]"
      >
        <Logo
          className="animate-color animate-pulse bg-transparent"
        />

        <div>
          <span
            className="font-[500] text-[18px]"
          >
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
