import './DogInfo.scss'
import { DogsData } from "../Dogs/Dogs.tsx";

interface DogInfoProps {
  dogInfo: DogsData;
}

function DogInfo({ dogInfo }: DogInfoProps) {
  if (!dogInfo) return null;

  return (
    <div className={'dog-info'}>
      <div className={'name-container'}>
        <span className={'name'}>{dogInfo.name}</span>
        <span className={'kennel-name'}>({dogInfo.kennelName})</span>
      </div>
      <span><b>Syntynyt:</b> {dogInfo.birthday.toLocaleDateString('fi', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}</span>
      <span><b>Äiti:</b> {dogInfo.mom}</span>
      <span><b>Isä:</b> {dogInfo.dad}</span>
      <span><b>Koko:</b> {dogInfo.size}</span>
      <span><b>Kuvaus:</b> {dogInfo.description}</span>
    </div>
  )
}

export default DogInfo
