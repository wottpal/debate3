import { FC, PropsWithChildren } from 'react'
import 'twin.macro'

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <main tw="flex-grow bg-gray-50">
        <div tw="absolute top-[-0px] right-[-150px] -scale-y-90 opacity-75">
          {/* <Image src={shapeImg} alt="Background" /> */}
        </div>
        {children}
      </main>
    </>
  )
}
