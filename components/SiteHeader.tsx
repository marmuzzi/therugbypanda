import BrandLockup from "./BrandLockup";
import HeaderNav from "./HeaderNav";

export default function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <BrandLockup />
      <HeaderNav />
    </header>
  );
}
