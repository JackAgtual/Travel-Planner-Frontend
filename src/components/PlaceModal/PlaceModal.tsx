import { useEffect, forwardRef, ForwardedRef } from 'react'
import usePlaceDetails from '../../hooks/usePlaceDetails'
import { PlaceData, SelectedPlaces } from '../../types/place'
import ImageCarousel from './ImageCarousel'
import FavoriteIcon from '../FavoriteIcon'
import Reviews from './Reviews'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import PlaceModalSkeleton from './PlaceModalSkeleton'

type PlaceModalProps = {
  place: PlaceData
  modalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedPlaces: React.Dispatch<React.SetStateAction<SelectedPlaces>>
  addedToMap: boolean
  setAddedToMap: React.Dispatch<React.SetStateAction<boolean>>
}

function PlaceModal(
  {
    place,
    modalOpen,
    setModalOpen,
    setSelectedPlaces,
    addedToMap,
    setAddedToMap,
  }: PlaceModalProps,
  ref: ForwardedRef<HTMLDialogElement>,
) {
  const [placeDetails, isLoading, , fetchDetails] = usePlaceDetails(place.id)

  const handleCardClose = () => {
    setModalOpen(false)
  }

  const closeModal = () => {
    if (!ref || typeof ref === 'function') return
    ref.current?.close()
  }

  const handleModalClick = (e: MouseEvent) => {
    if (!ref || typeof ref === 'function') return

    const rect = ref.current?.getBoundingClientRect()

    if (!rect) return

    const { left, right, top, bottom } = rect
    const { clientX: clickX, clientY: clickY } = e

    if (clickX < left || clickX > right || clickY > bottom || clickY < top) {
      closeModal()
    }
  }

  useEffect(() => {
    if (!ref || typeof ref === 'function') return

    if (!modalOpen) return

    const cardElement = ref.current

    if (!cardElement) return

    cardElement.showModal()

    cardElement.addEventListener('cancel', handleCardClose)
    cardElement.addEventListener('close', handleCardClose)
    cardElement.addEventListener('click', handleModalClick)

    fetchDetails()

    return () => {
      cardElement.removeEventListener('cancel', handleCardClose)
      cardElement.removeEventListener('close', handleCardClose)
      cardElement.removeEventListener('click', handleModalClick)
    }
  }, [modalOpen])

  return (
    <dialog autoFocus={false} ref={ref} className="max-w-5xl cursor-auto space-y-4">
      {isLoading ? (
        <PlaceModalSkeleton />
      ) : (
        <>
          <div className="flex items-center justify-between gap-x-4">
            <h1 className="text-center text-2xl">{place.name}</h1>
            <div className="flex items-center gap-x-4">
              <FavoriteIcon
                place={place}
                setSelectedPlaces={setSelectedPlaces}
                addedToMap={addedToMap}
                setAddedToMap={setAddedToMap}
              />
              <button onClick={closeModal}>
                <AiOutlineCloseCircle className="h-7 w-7" />
              </button>
            </div>
          </div>
          <div className="aspect-video">
            <ImageCarousel images={placeDetails?.photoUrls} />
          </div>
          <p>{placeDetails?.description}</p>
          <div>
            <a
              className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
              href={placeDetails?.address?.googleMapsUrl || '#'}
              target="_blank"
            >
              {placeDetails?.address?.formatted || ''}
            </a>
            <p>{placeDetails?.phoneNumber}</p>
            {placeDetails?.website !== null && (
              <a
                className="text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
                href={placeDetails?.website}
                target="_blank"
              >
                Visit their website
              </a>
            )}
          </div>
          {placeDetails?.businessHours !== null && (
            <div>
              <h2 className="text-xl font-semibold">Hours:</h2>
              <ul>
                {placeDetails?.businessHours?.map((hours, idx) => {
                  return <li key={idx}>{hours}</li>
                })}
              </ul>
            </div>
          )}
          {placeDetails?.reviews !== null && (
            <>
              <h2 className="text-xl font-semibold">Reviews</h2>
              <Reviews reviews={placeDetails?.reviews || []} />
            </>
          )}
        </>
      )}
    </dialog>
  )
}

export default forwardRef(PlaceModal)
