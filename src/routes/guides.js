import {useParams} from "react-router-dom";
import GuideContainer from "../Components/GuideContainer";

export default function Guide(props) {
    console.log("[guide.js]",props)
    let params = useParams();
    return <GuideContainer id={params.id} />
}
