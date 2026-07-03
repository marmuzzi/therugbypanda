import Image from "next/image";
import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[132px_minmax(0,1fr)] items-center gap-2 px-4 py-4 sm:grid-cols-[156px_minmax(0,1fr)] sm:gap-4 sm:px-6 md:grid-cols-[210px_minmax(0,1fr)_180px] md:gap-5 md:px-8 md:py-5 lg:grid-cols-[238px_minmax(0,1fr)_220px] lg:gap-6 lg:py-5">
      <Link href="/" aria-label="The Rugby Panda home" className="block justify-self-end md:justify-self-start">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda"
          width={280}
          height={280}
          priority
          sizes="(max-width: 640px) 132px, (max-width: 768px) 156px, (max-width: 1024px) 210px, 238px"
          className="h-[132px] w-[132px] object-contain sm:h-[156px] sm:w-[156px] md:h-[210px] md:w-[210px] lg:h-[238px] lg:w-[238px]"
        />
      </Link>

      <Link href="/" aria-label="The Rugby Panda home" className="min-w-0 overflow-hidden">
        <p className="font-black uppercase leading-[0.82] tracking-tight text-[#003D2B]">
          <span className="block text-[1.45rem] leading-none sm:text-[2.05rem] md:text-[2.55rem] lg:text-[3rem]">
            The
          </span>
          <span className="block text-[2.05rem] leading-[0.82] sm:text-[3.2rem] md:text-[4.25rem] lg:text-[5.25rem]">
            Rugby Panda
          </span>
        </p>
        <p className="mt-2 max-w-[20rem] text-[0.54rem] font-black uppercase leading-4 tracking-[0.12em] text-[#005C2F] sm:mt-3 sm:max-w-none sm:text-[0.7rem] md:text-xs md:tracking-[0.25em] lg:text-sm">
          Independent rugby news. Insight. Analysis.
        </p>
      </Link>
    </div>
  );
}
