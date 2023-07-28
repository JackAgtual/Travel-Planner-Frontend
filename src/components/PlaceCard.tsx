import { PlaceData, SelectedPlaces } from '../types/place'

type PlaceCardProps = {
  place: PlaceData
  setSelectedPlaces: React.Dispatch<React.SetStateAction<SelectedPlaces>>
}

function PlaceCard({ place, setSelectedPlaces }: PlaceCardProps) {
  const getRatingString = (place: PlaceData) => {
    if (place.numRatings === 0) {
      return 'No ratings'
    }

    return `${place.rating} / 5 (${place.numRatings} ${
      place.numRatings === 1 ? 'rating' : 'ratings'
    })`
  }

  const handleAddToMapClick = () => {
    setSelectedPlaces((prevPlaces) => {
      const updatedSelectedPlaces = new Set(prevPlaces)
      updatedSelectedPlaces.add(place)
      return updatedSelectedPlaces
    })
  }

  return (
    <div className="mx-auto box-border flex max-w-sm flex-col justify-center rounded-md border-2 text-lg">
      <img
        src={place.photoUrl}
        className="mx-auto aspect-video w-full rounded-md object-none"
      />
      <h1 className="mx-auto max-w-xs truncate px-4 text-center text-xl">{place.name}</h1>
      <p className="text-center">{getRatingString(place)}</p>
      <button
        className="mx-auto my-2 w-fit rounded-md bg-slate-200 px-6 py-1"
        onClick={handleAddToMapClick}
      >
        Add to map
      </button>
    </div>
  )
}

export default PlaceCard
