"use client";
import {Col, Row, Image, Button, Card, Space  } from "antd";

export default function PortfolioPage() {
    return (
        <div className="w-full max-w-[640px] grid grid-cols-1 sm:grid-cols-1 gap-4">

            <div
                style={{ backgroundColor: 'var(--bg-custom-dark)' }} 
                className="flex-1 min-w-[50%] text-white p-10 rounded-lg"
            >
                <h3 className="font-medium text-white mb-3 text-lg">Арьс арчилгаа, гоо сайхны онлайн платформ</h3>
                <div className="text-white/65 text-sm/6">
                    <ul className="list-image-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNCAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjMzhiZGY4Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy42ODUuMTUzYS43NTIuNzUyIDAgMCAxIC4xNDMgMS4wNTJsLTggMTAuNWEuNzUuNzUgMCAwIDEtMS4xMjcuMDc1bC00LjUtNC41YS43NS43NSAwIDAgMSAxLjA2LTEuMDZsMy44OTQgMy44OTMgNy40OC05LjgxN2EuNzUuNzUgMCAwIDEgMS4wNS0uMTQzWiIgLz48L3N2Zz4=')] pl-5 text-gray-900 dark:text-gray-200">
                        <li>Онлайн худалдаа</li>
                        <li>Subscription үйлчилгээ</li>
                    </ul>
                </div>
                
            </div>

            <div
                style={{ backgroundColor: 'var(--bg-custom-dark)' }} 
                className="flex-1 min-w-[50%] text-white p-10 rounded-lg"
            >
                <h3 className="font-medium text-white mb-3 text-lg">Wordpress + Woocommerce сайтад зориулсан төлбөрийн шийдэл</h3>
                <div className="text-sm text-white/55 mb-5">Ажилласан он: 2015 ~</div>
                <div className="text-white/65 text-sm/6">
                    <div className="mb-3">Wordpress + Woocommerce ашиглан вэб ажиллуулж буй хүмүүст шууд суулгаад хэрэглэх боломжтой. Таны үйлчлүүлэгч захиалгын төлбөрөө онлайнаар төлөх боломжууд:</div>
                    <ul className="list-image-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNCAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjMzhiZGY4Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy42ODUuMTUzYS43NTIuNzUyIDAgMCAxIC4xNDMgMS4wNTJsLTggMTAuNWEuNzUuNzUgMCAwIDEtMS4xMjcuMDc1bC00LjUtNC41YS43NS43NSAwIDAgMSAxLjA2LTEuMDZsMy44OTQgMy44OTMgNy40OC05LjgxN2EuNzUuNzUgMCAwIDEgMS4wNS0uMTQzWiIgLz48L3N2Zz4=')] pl-5 text-gray-900 dark:text-gray-200">
                        <li>Qpay</li>
                        <li>SocialPay</li>
                        <li>Банкны картууд</li>
                        <li>Pocket Zero</li>
                        <li>Storepay</li>
                        <li>Digipay</li>
                        <li>Дансаар шилжүүлэх (corporate gateway)</li>
                    </ul>
                </div>
                
            </div>
            <div
                style={{ backgroundColor: 'var(--bg-custom-dark)' }} 
                className="flex-1 min-w-[50%] text-white p-10 rounded-lg"
            >
                <h3 className="font-medium text-white mb-3 text-lg">Монголын Оюун Ухааны Академи</h3>
                <div className="text-white/65 text-sm/6">
                    <div className="mb-3">МОУА-гийн үндсэн вэб болон бусад оюуны спорт, спорт өрөлт, шооны холбоо, human calculator зэрэг вэб сайтуудыг хийж гүйцэтгэв. Эдгээр вэбүүд нь тухайн төрөлдөө Тамричин болон тэмцээний бүртэл, тэмцээний үр дүнг эрэмбэлэх, тамирчдын чансааг тооцох гэх мэт ижил төстэй үйлдлүүдийг гүйцэтгэнэ.</div>
                    <ul className="list-image-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNCAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjMzhiZGY4Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy42ODUuMTUzYS43NTIuNzUyIDAgMCAxIC4xNDMgMS4wNTJsLTggMTAuNWEuNzUuNzUgMCAwIDEtMS4xMjcuMDc1bC00LjUtNC41YS43NS43NSAwIDAgMSAxLjA2LTEuMDZsMy44OTQgMy44OTMgNy40OC05LjgxN2EuNzUuNzUgMCAwIDEgMS4wNS0uMTQzWiIgLz48L3N2Zz4=')] pl-5 text-gray-900 dark:text-gray-200">
                        <li>Тамирчдын профайл</li>
                        <li>Тэмцээний бүртгэл</li>
                        <li>Чансаа тооцох</li>
                        <li>Онлайн төлбөрийн шийдэл</li>
                        <li>ERP integration</li>
                    </ul>
                </div>
            </div>
            <div
                style={{ backgroundColor: 'var(--bg-custom-dark)' }} 
                className="flex-1 min-w-[50%] text-white p-10 rounded-lg"
            >
                <h3 className="font-medium text-white mb-3 text-lg">Дуу хөгжмийн онлайн дэлгүүр</h3>
                <div className="text-white/65 text-sm/6">
                    <div className="mb-3">Онлайн хөгжмийн дэлгүүрийг хөгжүүлэв. Вэб сайтаар хамтлаг дуучдын дуу, цомгийг биетээр хүргүүлэн авах эсвэл цахимаар татаж сонсох боломжтой.</div>
                    <ul className="list-image-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNCAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBmaWxsPSIjMzhiZGY4Ij48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMy42ODUuMTUzYS43NTIuNzUyIDAgMCAxIC4xNDMgMS4wNTJsLTggMTAuNWEuNzUuNzUgMCAwIDEtMS4xMjcuMDc1bC00LjUtNC41YS43NS43NSAwIDAgMSAxLjA2LTEuMDZsMy44OTQgMy44OTMgNy40OC05LjgxN2EuNzUuNzUgMCAwIDEgMS4wNS0uMTQzWiIgLz48L3N2Zz4=')] pl-5 text-gray-900 dark:text-gray-200">
                        <li>Цахим файлын сан</li>
                        <li>Онлайн төлбөрийн шийдэл</li>
                        <li>Онлайн радио</li>
                        <li>Уран бүтээлчийн каталог, борлуулалтын тайлан</li>
                        <li>Playtime.mn амьд хөгжмийн наадам</li>
                    </ul>
                </div>
            </div>
           
        </div>
    );
}