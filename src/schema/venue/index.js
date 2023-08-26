import { Event, Venue, User, Building, Order, RVLot, RVSpot, Document, AddOn, Stall } from 'Models';
import { superAdmin, adminOrOpsOrGroupLeader } from 'Lib/auth';

const getCurrentVenue = async (_, { id }, context) => {
  if (id || context.venue.id) {
    const [venue] = await Venue.getVenueById(id || context.venue.id, context?.user?.roleId);
    return venue;
  } else {
    return await Venue.getVenuesByUserId(context.user.id, context?.user?.roleId).then(res => res[0]);
  }
};

const getVenues = async (_, __, context) => {
  return await Venue.getVenues(context?.user?.roleId);
};

const createVenue = async (_, { input }, context) => {
  return await Venue.createVenue(input, context?.user?.roleId);
};

const Mutation = {
  createVenue: superAdmin(createVenue)
};

const Query = {
  venue: adminOrOpsOrGroupLeader(getCurrentVenue),
  venues: superAdmin(getVenues)
};

const resolvers = {
  Query,
  Mutation,
  Venue: {
    async users(parent, options, context) {
      const [users] = await User.getFilteredUsersByVenueId(parent.id, options, context?.user?.roleId);
      return users;
    },
    async events(parent, options, context) {
      return await Event.getFilteredEventsByVenueId(parent.id, options, context?.user?.roleId);
    },
    async buildings(parent, options, context) {
      const [buildings] = await Building.getBuildingsByVenueId(parent.id, options, context?.user?.roleId);
      return buildings;
    },
    async rvLots(parent, _, context) {
      const [rvLots] = await RVLot.getRVLotsByVenueId(parent.id, context?.user?.roleId);
      return rvLots;
    },
    async orders(parent, options, context) {
      const [orders] = await Order.getFilteredOrdersByVenueId(options, context?.user?.roleId);
      return orders;
    },
    async venueAgreements(parent, _, context) {
      const [documents] = await Document.getDocuments({ typeId: 1, venueId: parent.id }, context?.user?.roleId);
      return documents;
    },
    async venueMaps(parent, _, context) {
      const [documents] = await Document.getDocuments({ typeId: 2, venueId: parent.id }, context?.user?.roleId);
      return documents;
    },
    async addOns(parent, _, context) {
      const [addOns] = await AddOn.getAddOnsByVenueId(parent.id, context?.user?.roleId);
      return addOns;
    },
    async stalls(parent, options, context) {
      const [stalls] = await Stall.getStallsByVenueId(parent.id, options, context?.user?.roleId);
      return stalls;
    },
    async rvs(parent, options, context) {
      let [rvs] = await RVSpot.getRVSpotsByVenueId(parent.id, options, context?.user?.roleId);
      return rvs;
    }
  }
};

export default resolvers;
