import { useSetRecoilState } from 'recoil'
import {
    alignedImagePathState,
    maskPathState,
    originImageState,
    previewImagePathState,
} from '../state/image'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { runProjection, SERVER_URL } from '../api/image'

export const useSetImage = () => {
    const queryClient = useQueryClient()
    const setOriginImage = useSetRecoilState(originImageState)
    const setPreviewImagePath = useSetRecoilState(previewImagePathState)
    const setMaskPath = useSetRecoilState(maskPathState)
    const setAlignedPath = useSetRecoilState(alignedImagePathState)
    const mutation = useMutation({
        mutationFn: runProjection,
        onSuccess: (res) => {
            queryClient.invalidateQueries({ queryKey: ['preview-images'] })

            const img = new Image() //이미지 객체 생성
            img.src = `${SERVER_URL}/${res.data.aligned_path}`
            img.crossOrigin = 'Anonymous'
            img.addEventListener('load', () => {
                setOriginImage(img)
            })
            setPreviewImagePath(`${SERVER_URL}/${res.data.projection_path}`)
            setMaskPath(res.data.mask_path)
            setAlignedPath(res.data.aligned_path)
        },
    })

    const handleClick = () => {
        const f = document.createElement('input')
        f.type = 'file'
        f.addEventListener('change', (e) => {
            const file = e.target.files[0]
            mutation.mutate({ image: file })
        })
        f.click()
    }
    return { handleClick }
}
