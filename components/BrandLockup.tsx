import Image from "next/image";
import Link from "next/link";

export default function BrandLockup() {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 md:justify-start md:px-8 md:py-4">
      <Link href="/" aria-label="The Rugby Panda home" className="shrink-0">
        <Image
          src="/rugby-panda-logo.png"
          alt="The Rugby Panda"
          width={220}
          height={220}
          priority
          sizes="(max-width: 640px) 112px, (max-width: 1024px) 150px, 178px"
          className="h-[112px] w-[112px] object-contain sm:h-[150px] sm:w-[150px] lg:h-[178px] lg:w-[178px]"
        />
      </Link>
      <Link href="/" aria-label="The Rugby Panda home" className="min-w-0">
        <p className="font-black uppercase leading-[0.86] tracking-tight text-[#003D2B]">
          <span className="block text-lg leading-none sm:text-xl lg:text-2xl">The</span>
          <span className="block text-[2.2rem] leading-[0.88] sm:text-[3rem] lg:text-[3.8rem]">
            Rugby Panda
          </span>
        </p>
        <p className="mt-2 text-[0.58rem] font-black uppercase tracking-[0.12em] text-[#005C2F] sm:text-[0.74rem] sm:tracking-[0.18em] lg:text-[0.86rem]">
          The game. The people. The stories.
        </p>
      </Link>
    </div>
  );
}
