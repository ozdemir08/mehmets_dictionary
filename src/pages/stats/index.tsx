import NavigationBar from "../components/navigation_bar";

export default function Stats() {
  return (
    <>
      <NavigationBar />
      <main className="top-align justify-top-center mx-auto flex max-w-screen-lg flex-col">
        <div className="p-10 text-xl">Work in progress...</div>
        <div className="text-xl">Example:</div>
        <table className="mt-4">
          <ul>You have looked up 1000 words.</ul>
          <ul>You are learning 300 words.</ul>
          <ul>You are mastering 200 words.</ul>
          <ul>You have learned 100 words.</ul>
        </table>
      </main>
    </>
  );
}
