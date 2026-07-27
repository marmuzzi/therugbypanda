import Image from "next/image";
import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center gap-4 px-4 py-3 sm:gap-5 sm:px-6 md:justify-start md:px-8 md:py-4">
      <Link href="/" aria-label="The Rugby Panda home" className="shrink-0">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda"
          width={144}
          height={144}
          priority
          sizes="(max-width: 640px) 72px, (max-width: 1024px) 92px, 110px"
          className="h-[72px] w-[72px] object-contain sm:h-[92px] sm:w-[92px] lg:h-[110px] lg:w-[110px]"
        />
      </Link>
      <Link href="/" aria-label="The Rugby Panda home" className="min-w-0">
        <p className="font-black uppercase leading-[0.86] tracking-tight text-[#003D2B]">
          <span className="block text-base leading-none sm:text-lg lg:text-xl">The</span>
          <span className="block text-[2rem] leading-[0.88] sm:text-[2.65rem] lg:text-[3.25rem]">Rugby Panda</span>
        </p>
        <p className="mt-1 text-[0.54rem] font-black uppercase tracking-[0.14em] text-[#005C2F] sm:text-[0.65rem] sm:tracking-[0.2em] lg:text-[0.72rem]">The game. The people. The stories.</p>
      </Link>
    </div>
  );
}
