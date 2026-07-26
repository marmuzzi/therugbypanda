import Image from "next/image";
import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[112px_minmax(0,1fr)] items-center gap-1 px-4 py-1.5 sm:grid-cols-[136px_minmax(0,1fr)] sm:gap-3 sm:px-6 md:grid-cols-[176px_minmax(0,1fr)_140px] md:gap-3 md:px-8 md:py-2 lg:grid-cols-[190px_minmax(0,1fr)_160px] lg:gap-4 lg:py-2">
      <Link href="/" aria-label="The Rugby Panda home" className="block justify-self-end md:justify-self-start">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda"
          width={280}
          height={280}
          priority
          sizes="(max-width: 640px) 112px, (max-width: 768px) 136px, (max-width: 1024px) 176px, 190px"
          className="h-[112px] w-[112px] object-contain sm:h-[136px] sm:w-[136px] md:h-[176px] md:w-[176px] lg:h-[190px] lg:w-[190px]"
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
        <p className="mt-1.5 max-w-[20rem] text-[0.52rem] font-black uppercase leading-4 tracking-[0.12em] text-[#005C2F] sm:mt-2 sm:max-w-none sm:text-[0.68rem] md:text-[0.68rem] md:tracking-[0.2em] lg:text-[0.72rem]">
          The game. The people. The stories.
        </p>
      </Link>
    </div>
  );
}
