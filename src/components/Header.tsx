import danaker from '../assets/logos/danaker.png'
import ishoj from '../assets/logos/ishoj.png'
import suatas from '../assets/logos/suatas.png'
import cultivateCq from '../assets/logos/cultivate_cq.png'
import euFlag from '../assets/logos/eu_flag.png'

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-6 py-4 flex-wrap">
        <div className="flex items-center gap-6 flex-wrap">
          <img src={danaker} alt="Danaker" className="h-20 w-auto" />
          <img src={ishoj} alt="Ishøj Ung Kultur" className="h-12 w-auto" />
          <img src={suatas} alt="Suatas Project Academy" className="h-16 w-auto" />
        </div>
        <img src={cultivateCq} alt="Cultivate CQ" className="h-24 w-auto" />
        <img src={euFlag} alt="Co-funded by the European Union" className="h-14 w-auto" />
      </div>
    </header>
  )
}
