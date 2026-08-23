import { Link } from 'react-router-dom'
import t from '../../utils/translations'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-white">آنیمه‌پلاس</span>
            </Link>
            <p className="text-gray-400 max-w-md">
              بهترین پلتفرم برای تماشای انیمه، خواندن مانگا و مانها با زیرنویس فارسی.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/anime" className="text-gray-400 hover:text-white transition-colors">
                  {t.anime}
                </Link>
              </li>
              <li>
                <Link to="/manga" className="text-gray-400 hover:text-white transition-colors">
                  {t.manga}
                </Link>
              </li>
              <li>
                <Link to="/manhwa" className="text-gray-400 hover:text-white transition-colors">
                  {t.manhwa}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">پشتیبانی</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  سوالات متداول
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  تماس با ما
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  شرایط استفاده
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} آنیمه‌پلاس. تمامی حقوق محفوظ است.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">توییتر</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">اینستاگرام</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.01-3.807.055-.963.045-1.572.218-2.056.46-.568.268-1.04.623-1.504 1.26a4.902 4.902 0 00-1.26 1.504c-.242.484-.415 1.093-.46 2.056-.047 1.023-.055 1.351-.055 3.807v.468c0 2.456.01 2.784.055 3.807.045.963.218 1.572.46 2.056.268.568.623 1.04 1.26 1.504.568.424 1.04.823 1.504 1.26.484.242 1.093.415 2.056.46 1.023.047 1.351.055 3.807.055h.468c2.456 0 2.784-.01 3.807-.055.963-.045 1.572-.218 2.056-.46.568-.268 1.04-.623 1.504-1.26.424-.568.823-1.04 1.26-1.504.242-.484.415-1.093.46-2.056.047-1.023.055-1.351.055-3.807v-.468c0-2.456-.01-2.784-.055-3.807-.045-.963-.218-1.572-.46-2.056-.268-.568-.623-1.04-1.26-1.504-.568-.424-1.04-.823-1.504-1.26-.484-.242-1.093-.415-2.056-.46-1.023-.047-1.351-.055-3.807-.055zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
