import Image from "next/image";
import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center gap-5 px-4 py-4 sm:gap-6 sm:px-6 md:justify-start md:px-8 md:py-5">
      <Link href="/" aria-label="The Rugby Panda home" className="shrink-0">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda"
          width={180}
          height={180}
          priority
          sizes="(max-width: 640px) 82px, (max-width: 1024px) 112px, 138px"
          className="h-[82px] w-[82px] object-contain sm:h-[112px] sm:w-[112px] lg:h-[138px] lg:w-[138px]"
        />
      </Link>
      <Link href="/" aria-label="The Rugby Panda home" className="min-w-0">
        <p className="font-black uppercase leading-[0.84] tracking-tight text-[#003D2B]">
          <span className="block text-lg leading-none sm:text-xl lg:text-2xl">The</span>
          <span className="block text-[2.35rem] leading-[0.86] sm:text-[3.15rem] lg:text-[4rem]">
            Rugby Panda
          </span>
        </p>
        <p className="mt-1.5 text-[0.58rem] font-black uppercase tracking-[0.14em] text-[#005C2F] sm:text-[0.72rem] sm:tracking-[0.2em] lg:text-[0.84rem]">
          The game. The people. The stories.
        </p>
      </Link>
    </div>
  );
}
