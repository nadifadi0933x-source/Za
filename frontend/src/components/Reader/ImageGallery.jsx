import { motion } from 'framer-motion'

const ImageGallery = ({ src, alt, zoom }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center"
    >
      <img
        src={src}
        alt={alt}
        style={{ transform: `scale(${zoom})` }}
        className="max-w-full h-auto transition-transform duration-200"
        draggable={false}
      />
    </motion.div>
  )
}

export default ImageGallery
