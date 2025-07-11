import { SignIn } from "@clerk/nextjs";

const LoginPage = () => {
  return (
    <div className=" flex justify-center items-center mt-16">
      <SignIn routing="hash" />
    </div>
  );
};

export default LoginPage;
