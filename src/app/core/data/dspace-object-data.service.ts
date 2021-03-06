import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { ObjectCacheService } from '../cache/object-cache.service';
import { CoreState } from '../core.reducers';
import { DSpaceObject } from '../shared/dspace-object.model';
import { DSPACE_OBJECT } from '../shared/dspace-object.resource-type';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { DataService } from './data.service';
import { DSOChangeAnalyzer } from './dso-change-analyzer.service';
import { RemoteData } from './remote-data';
import { RequestService } from './request.service';
import { FindListOptions } from './request.models';
import { PaginatedList } from './paginated-list.model';

/* tslint:disable:max-classes-per-file */
class DataServiceImpl extends DataService<DSpaceObject> {
  protected linkPath = 'dso';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<CoreState>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<DSpaceObject>) {
    super();
  }

  getIDHref(endpoint, resourceID,  ...linksToFollow: FollowLinkConfig<DSpaceObject>[]): string {
    return this.buildHrefFromFindOptions( endpoint.replace(/\{\?uuid\}/, `?uuid=${resourceID}`),
      {}, [], ...linksToFollow);
  }
}

@Injectable()
@dataService(DSPACE_OBJECT)
export class DSpaceObjectDataService {
  protected linkPath = 'dso';
  private dataService: DataServiceImpl;

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<DSpaceObject>) {
    this.dataService = new DataServiceImpl(requestService, rdbService, null, objectCache, halService, notificationsService, http, comparator);
  }

  /**
   * Returns an observable of {@link RemoteData} of an object, based on its ID, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the object
   * @param id                ID of object we want to retrieve
   * @param reRequestOnStale  Whether or not the request should automatically be re-requested after
   *                          the response becomes stale
   * @param linksToFollow     List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findById(id: string, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DSpaceObject>[]): Observable<RemoteData<DSpaceObject>> {
    return this.dataService.findById(id, reRequestOnStale, ...linksToFollow);

  }
  /**
   * Returns an observable of {@link RemoteData} of an object, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the object
   * @param href              The url of object we want to retrieve
   * @param reRequestOnStale  Whether or not the request should automatically be re-requested after
   *                          the response becomes stale
   * @param linksToFollow     List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findByHref(href: string, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DSpaceObject>[]): Observable<RemoteData<DSpaceObject>> {
    return this.dataService.findByHref(href, reRequestOnStale, ...linksToFollow);
  }

  /**
   * Returns a list of observables of {@link RemoteData} of objects, based on an href, with a list of {@link FollowLinkConfig},
   * to automatically resolve {@link HALLink}s of the object
   * @param href              The url of object we want to retrieve
   * @param findListOptions   Find list options object
   * @param reRequestOnStale  Whether or not the request should automatically be re-requested after
   *                          the response becomes stale
   * @param linksToFollow     List of {@link FollowLinkConfig} that indicate which {@link HALLink}s should be automatically resolved
   */
  findAllByHref(href: string, findListOptions: FindListOptions = {}, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<DSpaceObject>[]): Observable<RemoteData<PaginatedList<DSpaceObject>>> {
    return this.dataService.findAllByHref(href, findListOptions, reRequestOnStale, ...linksToFollow);
  }

}
/* tslint:enable:max-classes-per-file */
