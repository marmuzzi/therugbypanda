import Image from "next/image";
import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[124px_minmax(0,1fr)] items-center gap-2 px-4 py-4 sm:grid-cols-[148px_minmax(0,1fr)] sm:gap-4 sm:px-6 md:grid-cols-[180px_minmax(0,1fr)_180px] md:gap-5 md:px-8 md:py-4 lg:grid-cols-[190px_minmax(0,1fr)_220px] lg:gap-6 lg:py-4">
      <Link href="/" aria-label="The Rugby Panda home" className="block justify-self-end md:justify-self-start">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda"
          width={280}
          height={280}
          priority
          sizes="(max-width: 640px) 124px, (max-width: 768px) 148px, (max-width: 1024px) 180px, 190px"
          className="h-[124px] w-[124px] object-contain sm:h-[148px] sm:w-[148px] md:h-[180px] md:w-[180px] lg:h-[190px] lg:w-[190px]"
        />
      </Link>

      <Link href="/" aria-label="The Rugby Panda home" className="min-w-0 overflow-hidden">
        <p className="font-black uppercase leading-[0.86] tracking-tight text-[#003D2B]">
          <span className="block text-[1.35rem] leading-none sm:text-[1.9rem] md:text-[2rem] lg:text-[2.25rem]">
            The
          </span>
          <span className="block text-[1.9rem] leading-[0.86] sm:text-[2.9rem] md:text-[3.2rem] lg:text-[3.75rem] xl:text-[4rem]">
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
