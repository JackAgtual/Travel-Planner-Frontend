import DestinationDisplaySkeleton from './DestinationDisplaySkeleton'
import Map from '../Map'
import {
  Coordinates,
  PlaceResponse,
  queryParamToDisplayType,
  SelectedPlaces,
} from '../../types/place'
import PlacesGrid from '../PlacesGrid'
import Weather from '../Weather'

type DestinationDisplayProps = {
  loadingDestination: boolean
  destinationError: boolean
  mapCoordinates: Coordinates
  googleMapsIsLoaded: boolean
  places: PlaceResponse
  selectedPlaces: SelectedPlaces
  setSelectedPlaces: React.Dispatch<React.SetStateAction<SelectedPlaces>>
}

function DestinationDisplay({
  loadingDestination,
  destinationError,
  mapCoordinates,
  googleMapsIsLoaded,
  places,
  selectedPlaces,
  setSelectedPlaces,
}: DestinationDisplayProps) {
  if (destinationError) {
    return <p className="text-center text-2xl">Sorry, we had trouble with that search.</p>
  }

  if (loadingDestination) {
    return <DestinationDisplaySkeleton />
  }

  return (
    <div className="mb-10 space-y-4">
      <Map
        coordinates={mapCoordinates}
        selectedPlaces={selectedPlaces}
        isLoaded={googleMapsIsLoaded}
      />
      <div className="space-y-10">
        {places.map((place) => {
          const name =
            queryParamToDisplayType[place.type as keyof typeof queryParamToDisplayType]
          return (
            <PlacesGrid
              key={place.type}
              placeType={name}
              places={place.data}
              setSelectedPlaces={setSelectedPlaces}
            />
          )
        })}
      </div>
      <Weather coordinates={mapCoordinates} />
    </div>
  )
}

export default DestinationDisplay
