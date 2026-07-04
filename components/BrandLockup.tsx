import Image from "next/image";
import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[132px_minmax(0,1fr)] items-center gap-1 px-4 py-3 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-3 sm:px-6 md:grid-cols-[210px_minmax(0,1fr)_160px] md:gap-3 md:px-8 md:py-3 lg:grid-cols-[230px_minmax(0,1fr)_190px] lg:gap-4 lg:py-3">
      <Link href="/" aria-label="The Rugby Panda home" className="block justify-self-end md:justify-self-start">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda"
          width={280}
          height={280}
          priority
          sizes="(max-width: 640px) 132px, (max-width: 768px) 160px, (max-width: 1024px) 210px, 230px"
          className="h-[132px] w-[132px] object-contain sm:h-[160px] sm:w-[160px] md:h-[210px] md:w-[210px] lg:h-[230px] lg:w-[230px]"
        />
      </Link>

      <Link href="/" aria-label="The Rugby Panda home" className="min-w-0 overflow-hidden">
        <p className="font-black uppercase leading-[0.86] tracking-tight text-[#003D2B]">
          <span className="block text-[1.2rem] leading-none sm:text-[1.65rem] md:text-[1.75rem] lg:text-[2rem]">
            The
          </span>
          <span className="block text-[1.65rem] leading-[0.86] sm:text-[2.45rem] md:text-[2.8rem] lg:text-[3.25rem] xl:text-[3.6rem]">
            Rugby Panda
          </span>
        </p>
        <p className="mt-2 max-w-[20rem] text-[0.52rem] font-black uppercase leading-4 tracking-[0.12em] text-[#005C2F] sm:mt-3 sm:max-w-none sm:text-[0.68rem] md:text-[0.68rem] md:tracking-[0.2em] lg:text-[0.72rem]">
          Independent rugby news. Insight. Analysis.
        </p>
      </Link>
    </div>
  );
}
