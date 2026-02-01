export default function Footer() {
  return (
    <footer className="border-t py-6 bg-slate-50">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-4">
        <p className="text-sm text-muted-foreground">
          Built by <span className="font-bold">Sandeep Saini</span>
        </p>
        <div className="flex gap-4">
          <a
            href="https://github.com/sandeep9062"
            className="text-sm underline"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/softwareengineeri-a6309924a/"
            className="text-sm underline"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
}
