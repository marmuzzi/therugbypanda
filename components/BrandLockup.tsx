import Image from "next/image";
import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center gap-6 px-4 py-4 sm:gap-7 sm:px-6 md:justify-start md:px-8 md:py-5">
      <Link href="/" aria-label="The Rugby Panda home" className="shrink-0">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda"
          width={220}
          height={220}
          priority
          sizes="(max-width: 640px) 92px, (max-width: 1024px) 132px, 164px"
          className="h-[92px] w-[92px] object-contain sm:h-[132px] sm:w-[132px] lg:h-[164px] lg:w-[164px]"
        />
      </Link>
      <Link href="/" aria-label="The Rugby Panda home" className="min-w-0">
        <p className="font-black uppercase leading-[0.82] tracking-tight text-[#003D2B]">
          <span className="block text-xl leading-none sm:text-2xl lg:text-[1.7rem]">The</span>
          <span className="block text-[2.65rem] leading-[0.84] sm:text-[3.65rem] lg:text-[4.75rem]">
            Rugby Panda
          </span>
        </p>
        <p className="mt-2 text-[0.64rem] font-black uppercase tracking-[0.14em] text-[#005C2F] sm:text-[0.82rem] sm:tracking-[0.2em] lg:text-[0.96rem]">
          The game. The people. The stories.
        </p>
      </Link>
    </div>
  );
}
