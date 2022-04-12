import { getProfile } from '../redux/actions/user'
import { getJWT, checkMobile } from './lib'
import uaParserJs from 'ua-parser-js';
import { getClientGqlSsr } from './getClientGQL'

export default async (ctx)=>{
    if (ctx.req) {
        let ua = uaParserJs(ctx.req.headers['user-agent'])
        ctx.store.getState().app.isMobileApp = ['mobile', 'tablet'].includes(ua.device.type)||checkMobile(ua.ua)
        ctx.store.getState().user.authenticated = getJWT(ctx.req.headers.cookie)
        if (ctx.store.getState().user.authenticated) {
            ctx.store.getState().user.profile = await getProfile(await getClientGqlSsr(ctx.req))
            if(['реализатор', 'организатор'].includes(ctx.store.getState().user.profile.role)) {
                ctx.store.getState().app.region = {
                    _id: ctx.store.getState().user.profile.region,
                    guid: ctx.store.getState().user.profile.guidRegion,
                    name: ctx.store.getState().user.profile.nameRegion
                }
                if ('реализатор' === ctx.store.getState().user.profile.role)
                    ctx.store.getState().app.point = {
                        _id: ctx.store.getState().user.profile.point,
                        guid: ctx.store.getState().user.profile.guidPoint,
                        name: ctx.store.getState().user.profile.namePoint
                    }
            }
            else {
                ctx.store.getState().app.region = undefined
                ctx.store.getState().app.point = undefined
            }
        }
        else {
            ctx.store.getState().user.profile = {}
            ctx.store.getState().app.region = undefined
            ctx.store.getState().app.point = undefined
            ctx.store.getState().app.realizator = undefined
            ctx.store.getState().app.inspector = undefined
        }
    }
    ctx.store.getState().app.search = ''
    ctx.store.getState().app.sort = '-createdAt'
    ctx.store.getState().app.filter = ''
    ctx.store.getState().app.date = ''
    ctx.store.getState().app.load = false
    ctx.store.getState().app.drawer = false
    ctx.store.getState().mini_dialog.show = false
    ctx.store.getState().mini_dialog.showFull = false
}