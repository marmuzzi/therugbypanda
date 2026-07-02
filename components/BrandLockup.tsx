import Image from "next/image";
import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[126px_minmax(0,1fr)] items-center gap-2 px-4 py-5 sm:grid-cols-[156px_minmax(0,1fr)] sm:gap-5 sm:px-6 md:grid-cols-[190px_minmax(0,1fr)_180px] md:gap-8 md:px-8 md:py-7 lg:grid-cols-[220px_minmax(0,1fr)_220px] lg:py-8">
      <Link href="/" aria-label="The Rugby Panda home" className="block justify-self-end md:justify-self-start">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda"
          width={260}
          height={260}
          priority
          sizes="(max-width: 640px) 126px, (max-width: 768px) 156px, (max-width: 1024px) 190px, 220px"
          className="h-[126px] w-[126px] object-contain sm:h-[156px] sm:w-[156px] md:h-[190px] md:w-[190px] lg:h-[220px] lg:w-[220px]"
        />
      </Link>

      <Link href="/" aria-label="The Rugby Panda home" className="min-w-0 overflow-hidden">
        <p className="font-black uppercase leading-[0.82] tracking-tight text-[#003D2B]">
          <span className="block text-[1.6rem] leading-none sm:text-[2.35rem] md:text-[3rem] lg:text-[3.7rem]">
            The
          </span>
          <span className="block text-[2.35rem] leading-[0.82] sm:text-[3.7rem] md:text-[5.2rem] lg:text-[6.55rem]">
            Rugby Panda
          </span>
        </p>
        <p className="mt-2 max-w-[20rem] text-[0.58rem] font-black uppercase leading-4 tracking-[0.13em] text-[#005C2F] sm:mt-3 sm:max-w-none sm:text-xs md:text-sm md:tracking-[0.28em] lg:text-base">
          Independent rugby news. Insight. Analysis.
        </p>
      </Link>
    </div>
  );
}
