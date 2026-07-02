import Image from "next/image";
import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[138px_minmax(0,1fr)] items-center gap-1 px-4 py-4 sm:grid-cols-[166px_minmax(0,1fr)] sm:gap-4 sm:px-6 md:grid-cols-[204px_minmax(0,1fr)_180px] md:gap-6 md:px-8 md:py-6 lg:grid-cols-[238px_minmax(0,1fr)_220px] lg:gap-7 lg:py-7">
      <Link href="/" aria-label="The Rugby Panda home" className="block justify-self-end md:justify-self-start">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda"
          width={280}
          height={280}
          priority
          sizes="(max-width: 640px) 138px, (max-width: 768px) 166px, (max-width: 1024px) 204px, 238px"
          className="h-[138px] w-[138px] object-contain sm:h-[166px] sm:w-[166px] md:h-[204px] md:w-[204px] lg:h-[238px] lg:w-[238px]"
        />
      </Link>

      <Link href="/" aria-label="The Rugby Panda home" className="min-w-0 overflow-hidden">
        <p className="font-black uppercase leading-[0.82] tracking-tight text-[#003D2B]">
          <span className="block text-[1.5rem] leading-none sm:text-[2.25rem] md:text-[2.9rem] lg:text-[3.55rem]">
            The
          </span>
          <span className="block text-[2.2rem] leading-[0.82] sm:text-[3.55rem] md:text-[5rem] lg:text-[6.3rem]">
            Rugby Panda
          </span>
        </p>
        <p className="mt-2 max-w-[20rem] text-[0.56rem] font-black uppercase leading-4 tracking-[0.12em] text-[#005C2F] sm:mt-3 sm:max-w-none sm:text-xs md:text-sm md:tracking-[0.26em] lg:text-base">
          Independent rugby news. Insight. Analysis.
        </p>
      </Link>
    </div>
  );
}
