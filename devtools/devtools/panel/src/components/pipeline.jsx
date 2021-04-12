import { unref } from 'vue'
const f = (s) => {
    const jsx = <observable ctx={s} streams={s.streams}>{s.sources.map(source =>
        <div class="subpipe">{f(source)}<div class='after' style={'color:white' + ';opacity:' + source.cdSub}>↑</div><div class='after' style={'color:' + source.pickColor() + ';opacity:' + source.cdData}>↓</div></div>
    )}</observable>
    return s.source ? (<>
        {f(s.source)}
        <middleArrow color={s.pickColor()} cdData={s.source.cdData} cdSub={s.source.cdSub} />
        {jsx}
    </>) : jsx
}

const middleArrow = ({ color, cdData, cdSub }) => unref(cdSub) > 0 ? < span class="arrow" style={'color:white' + ';opacity:' + unref(cdSub)} >←</span> : <span class="arrow" style={'color:' + color + ';opacity:' + unref(cdData)}>→</span>
export default ({ source }) => source && f(source)