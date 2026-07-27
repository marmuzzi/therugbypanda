import Image from "next/image";
import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 md:justify-start md:px-8 md:py-4">
      <Link href="/" aria-label="The Rugby Panda home" className="shrink-0">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda"
          width={120}
          height={120}
          priority
          sizes="(max-width: 640px) 64px, (max-width: 1024px) 76px, 88px"
          className="h-16 w-16 object-contain sm:h-[76px] sm:w-[76px] lg:h-[88px] lg:w-[88px]"
        />
      </Link>

      <Link href="/" aria-label="The Rugby Panda home" className="min-w-0">
        <p className="font-black uppercase leading-[0.86] tracking-tight text-[#003D2B]">
          <span className="block text-sm leading-none sm:text-base lg:text-lg">The</span>
          <span className="block text-[1.75rem] leading-[0.88] sm:text-[2.2rem] lg:text-[2.7rem]">
            Rugby Panda
          </span>
        </p>
        <p className="mt-1 text-[0.5rem] font-black uppercase tracking-[0.14em] text-[#005C2F] sm:text-[0.58rem] sm:tracking-[0.2em] lg:text-[0.64rem]">
          The game. The people. The stories.
        </p>
      </Link>
    </div>
  );
}
