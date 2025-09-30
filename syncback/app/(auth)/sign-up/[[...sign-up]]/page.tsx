import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f7ff] p-6">
      <SignUp
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/settings"
      />
    </div>
  );
}
