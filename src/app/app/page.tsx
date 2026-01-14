import LogoutButton from "../../components/ui/LogoutButton";

export default function AppPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to Second Brain</h1>
      <div className="mt-4">
        <LogoutButton />
      </div>
    </div>
  );
}
