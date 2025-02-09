import type {Series} from "@/api/models/response/Series/Series";
import type {SeriesContent} from "@/api/models/response/Series/SeriesContent";

export type SeriesDetailVO = {
    series: Series,
    seriesContentList: SeriesContent[]
}