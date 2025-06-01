export const SignInView = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5">
      <div className="bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto">
        Form Column
      </div>
      <div className="h-screen w-full lg:col-span-2 hidden lg:block">
        Background column
      </div>
    </div>
  );
};
