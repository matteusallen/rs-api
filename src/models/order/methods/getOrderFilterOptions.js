import { Op } from 'sequelize';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { GROUP_LEADER } from '../../../constants/roles';

const moment = extendMoment(Moment);

const getUTCFormattedDate = value => {
  return moment(value).utc().format('YYYY-MM-DD');
};

async function getOrderFilterOptions(venueId, user, { filterBy: filters }, roleId) {
  try {
    const [groupLeaderFilter, groupLeaderAssociation] = getGroupLeaderQueryInfo(user);
    let eventIds = [],
      groupIds = [];

    if (!filters.event) {
      const { Event } = this.sequelize.models;
      eventIds = await Event.getCurrentAndFutureEventsByVenueId(venueId);
      eventIds = eventIds || [await Event.getLastEventByVenueId(venueId)];
    }

    const initialFilters = {
      where: { successor: { [Op.is]: null }, ...groupLeaderFilter, ...(eventIds.length && { eventId: { [Op.in]: eventIds } }) },
      include: [
        { association: 'event', where: { venueId } },
        {
          association: 'orderItems',
          include: [],
          required: true
        },
        groupLeaderAssociation
      ].filter(Boolean),
      users: []
    };

    if (!filters) return [initialFilters, undefined];
    const filtersWithFilterBy = await Object.entries(filters).reduce(async (acc, [prop, value]) => {
      const resolvedAcc = await acc;

      const orderItemsIndex = resolvedAcc.include.findIndex(item => item.association === 'orderItems');
      const reservationIndex = resolvedAcc.include[orderItemsIndex].include.findIndex(item => item.association === 'reservation');
      const orderItemsWhere = resolvedAcc.include[orderItemsIndex].where;

      function addReservationWhereXRefType(id) {
        const reservationWhere = resolvedAcc.include[orderItemsIndex].include[reservationIndex].where;
        // adding the below to account for the fact that some cases (like allSpacesAssigned/spacesNeedAssignment)
        // don't include a where clause with the reservation association
        if (reservationWhere) {
          reservationWhere.xRefTypeId[Op.or].push(id);
        } else {
          resolvedAcc.include[orderItemsIndex].include[reservationIndex].where = { xRefTypeId: { [Op.or]: [id] } };
        }
      }

      function addOrderItemsWhereXRefType(id) {
        orderItemsWhere.xRefTypeId[Op.or].push(id);
      }

      function addReservationAssociationWithXRefType(id) {
        resolvedAcc.include[orderItemsIndex].include.push({
          association: 'reservation',
          where: { xRefTypeId: { [Op.or]: [id] } },
          include: []
        });
      }

      let opWithValue, eventIndex;
      switch (prop) {
        case 'user': {
          const { User } = this.sequelize.models;
          const userOptions = {
            filterBy: {
              fullName: value
            }
          };
          const [users] = await User.getUsers(userOptions, roleId);
          const userIds = users.map(user => user.id);

          resolvedAcc.where.userId = { [Op.in]: userIds };
          resolvedAcc.users = users;
          return resolvedAcc;
        }

        case 'stallName': {
          if (reservationIndex > -1) {
            resolvedAcc.include[orderItemsIndex].include[reservationIndex].include.push({
              association: 'reservationSpaces',
              required: true,
              include: [
                {
                  association: 'stall',
                  where: {
                    name: this.sequelize.where(
                      this.sequelize.fn('LOWER', this.sequelize.col('orderItems.reservationSpaces.stall.name')),
                      '=',
                      `${value.toLowerCase()}`
                    )
                  }
                }
              ]
            });
          } else {
            resolvedAcc.include[orderItemsIndex].include.push({
              association: 'reservation',
              where: { xRefTypeId: 1 },
              include: [
                {
                  association: 'reservationSpaces',
                  required: true,
                  include: [
                    {
                      association: 'stall',
                      where: {
                        name: this.sequelize.where(
                          this.sequelize.fn('LOWER', this.sequelize.col('orderItems.reservation.reservationSpaces.stall.name')),
                          '=',
                          `${value.toLowerCase()}`
                        )
                      }
                    }
                  ]
                }
              ]
            });
          }
          return resolvedAcc;
        }

        case 'rvSpotName': {
          if (reservationIndex > -1) {
            resolvedAcc.include[orderItemsIndex].include[reservationIndex].where = { xRefTypeId: { [Op.in]: [1, 3] } };
            resolvedAcc.include[orderItemsIndex].include[reservationIndex].include[0].include.push({
              association: 'rvSpot',
              where: { name: this.sequelize.where(this.sequelize.fn('LOWER', this.sequelize.col('orderItems.rvSpot.name')), '=', `${value.toLowerCase()}`) }
            });
          } else {
            resolvedAcc.include[orderItemsIndex].include.push({
              association: 'reservation',
              where: { xRefTypeId: 3 },
              include: [
                {
                  association: 'reservationSpaces',
                  required: true,
                  include: [
                    {
                      association: 'rvSpot',
                      where: {
                        name: this.sequelize.where(
                          this.sequelize.fn('LOWER', this.sequelize.col('orderItems.reservation.reservationSpaces.rvSpot.name')),
                          '=',
                          `${value.toLowerCase()}`
                        )
                      }
                    }
                  ]
                }
              ]
            });
          }
          return resolvedAcc;
        }

        case 'startDate': {
          const dateValStart = getUTCFormattedDate(moment(value).startOf('day'));
          const dateValEnd = getUTCFormattedDate(moment(filters.endDate).endOf('day'));

          if (reservationIndex < 0) {
            resolvedAcc.include[orderItemsIndex].include.push({
              association: 'reservation',
              where: {
                [Op.or]: {
                  [prop]: {
                    [Op.between]: [dateValStart, dateValEnd]
                  }
                }
              },
              include: []
            });
            return resolvedAcc;
          } else {
            const where = resolvedAcc.include[orderItemsIndex].include[reservationIndex].where[Op.or];
            Object.assign(where, {
              [prop]: {
                [Op.between]: [dateValStart, dateValEnd]
              }
            });
            return resolvedAcc;
          }
        }

        case 'endDate': {
          const dateValStart = getUTCFormattedDate(moment(filters.startDate).startOf('day'));
          const dateValEnd = getUTCFormattedDate(moment(value).endOf('day'));

          if (reservationIndex < 0) {
            resolvedAcc.include[orderItemsIndex].include.push({
              association: 'reservation',
              where: {
                [Op.or]: {
                  [prop]: {
                    [Op.between]: [dateValStart, dateValEnd]
                  }
                }
              },
              include: []
            });
            return resolvedAcc;
          } else {
            const where = resolvedAcc.include[orderItemsIndex].include[reservationIndex].where[Op.or];
            Object.assign(where, {
              [prop]: {
                [Op.between]: [dateValStart, dateValEnd]
              }
            });
            return resolvedAcc;
          }
        }

        case 'event': {
          eventIndex = resolvedAcc.include.findIndex(item => item.association === 'event');
          resolvedAcc.include[eventIndex].where = { venueId, name: { [Op.iLike]: `%${String(value)}%` } };
          return resolvedAcc;
        }

        case 'reservationStatus': {
          if (value === 0) {
            resolvedAcc.include[orderItemsIndex].include.push({
              association: 'reservation',
              where: { [Op.not]: { statusId: 4 } },
              include: []
            });
          } else if (value && reservationIndex === -1) {
            resolvedAcc.include[orderItemsIndex].include.push({
              association: 'reservation',
              where: { statusId: value },
              include: []
            });
          } else if (value && reservationIndex > -1) {
            if (!resolvedAcc.include[orderItemsIndex].include[reservationIndex].where) {
              resolvedAcc.include[orderItemsIndex].include[reservationIndex].where = { statusId: value };
            } else {
              resolvedAcc.include[orderItemsIndex].include[reservationIndex].where.statusId = value;
            }
          } else {
            resolvedAcc.include[orderItemsIndex].include.push({ association: 'addOnProduct' });
          }
          return resolvedAcc;
        }

        case 'hasStalls': {
          if (value) {
            if (reservationIndex > -1) {
              addReservationWhereXRefType(1);
            } else {
              addReservationAssociationWithXRefType(1);
            }
            if (orderItemsWhere) {
              addOrderItemsWhereXRefType(2);
            } else {
              resolvedAcc.include[orderItemsIndex].where = { xRefTypeId: { [Op.or]: [4] } };
            }
            return resolvedAcc;
          }
          return resolvedAcc;
        }

        case 'hasRVs': {
          if (value) {
            if (reservationIndex > -1) {
              addReservationWhereXRefType(3);
            } else {
              addReservationAssociationWithXRefType(3);
            }
            if (orderItemsWhere) {
              addOrderItemsWhereXRefType(2);
            } else {
              resolvedAcc.include[orderItemsIndex].where = { xRefTypeId: { [Op.or]: [4] } };
            }
            return resolvedAcc;
          }
          return resolvedAcc;
        }

        case 'hasAddOns': {
          if (value) {
            if (orderItemsWhere) {
              addOrderItemsWhereXRefType(4);
            } else {
              resolvedAcc.include[orderItemsIndex].where = { xRefTypeId: { [Op.or]: [2] } };
            }
            return resolvedAcc;
          }
          return resolvedAcc;
        }

        case 'hasSpecialReqs': {
          resolvedAcc.where.notes = { [Op.not]: '' };
          return resolvedAcc;
        }

        case 'spacesNeedAssignment': {
          if (value && reservationIndex < 0) {
            resolvedAcc.include[orderItemsIndex].include.push({
              association: 'reservation',
              include: []
            });
          }
          return resolvedAcc;
        }

        case 'allSpacesAssigned': {
          if (value && reservationIndex < 0) {
            resolvedAcc.include[orderItemsIndex].include.push({
              association: 'reservation',
              include: []
            });
          }
          return resolvedAcc;
        }

        case 'group':
          return resolvedAcc;

        default:
          opWithValue = { [Op.iLike]: `%${String(value)}%` };
      }
      return Object.assign(resolvedAcc, { [prop]: opWithValue });
    }, initialFilters);

    if (filters.group) {
      const { Group } = this.sequelize.models;
      groupIds = await Group.getGroupIdsByName(filters.group);
      const where = { groupId: { [Op.in]: groupIds } };
      const association = { association: 'groupOrder', where };
      const existingAssociation = filtersWithFilterBy.include.find(includeItem => includeItem.association === 'groupOrder');

      if (existingAssociation) {
        existingAssociation.where = where;
      } else {
        filtersWithFilterBy.include.push(association);
      }
    }

    return [filtersWithFilterBy, undefined];
  } catch (error) {
    return [undefined, error];
  }
}

const getGroupLeaderQueryInfo = user => {
  let groupLeaderFilter = {};
  let groupLeaderAssociation = null;

  if (user?.roleId === GROUP_LEADER) {
    groupLeaderFilter['$groupOrder.group.groupLeaderId$'] = user?.id;
    groupLeaderAssociation = { association: 'groupOrder', include: [{ association: 'group' }] };
  }

  return [groupLeaderFilter, groupLeaderAssociation];
};

export default getOrderFilterOptions;
